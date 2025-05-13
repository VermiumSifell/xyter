package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"git.zyner.org/meta/xyter/internal/bot"
	"git.zyner.org/meta/xyter/internal/config"
	"git.zyner.org/meta/xyter/internal/database"
)

func main() {
	k := config.Load()
	db := database.Open(k)
	database.Migrate(db)

	session, err := bot.Start(k, db)
	if err != nil {
		log.Fatalf("Error starting bot: %v", err)
	}
	defer session.Close()

	log.Println("Bot is running. Press CTRL-C to exit.")
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)
	<-stop
}
