package main

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"gopkg.in/olahol/melody.v1"
)

type Message struct {
	Event   string `json:"event"`
	Name    string `json:"name"`
	Content string `json:"content"`
}

func new_message(event, name, content string) *Message {
	return &Message{
		Event:   event,
		Name:    name,
		Content: content,
	}
}

func (m *Message) get_byte_mess() []byte {
	result, _ := json.Marshal(m)
	return result
}

func main() {

	r := gin.Default()
	r.LoadHTMLGlob("template/html/*")
	r.Static("/assets", "./template/assets")
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	m := melody.New()

	r.GET("/ws", func(c *gin.Context) {
		m.HandleRequest(c.Writer, c.Request)
	})

	m.HandleConnect(func(sess *melody.Session) {
		id := sess.Request.URL.Query().Get("id")
		m.Broadcast(new_message("other", id, "進入聊天室").get_byte_mess())
	})

	m.HandleClose(func(sess *melody.Session, i int, s string) error {
		id := sess.Request.URL.Query().Get("id")
		m.Broadcast(new_message("other", id, "離開聊天室").get_byte_mess())
		return nil
	})

	m.HandleMessage(func(s *melody.Session, mess []byte) {
		m.Broadcast(mess)
	})

	r.Run(":5000")

}
