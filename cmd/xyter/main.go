package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"net/http"

	"git.zyner.org/meta/xyter/internal/bot"
	"git.zyner.org/meta/xyter/internal/config"
	"git.zyner.org/meta/xyter/internal/database"
	"github.com/dromara/carbon/v2"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func main() {
	k := config.Load()
	db := database.Open(k)
	database.Migrate(db)
	carbon.SetDefault(carbon.Default{
		Layout:       carbon.DateTimeLayout,
		Timezone:     k.String("tz"),
		Locale:       "en",
		WeekStartsAt: carbon.Monday,
		WeekendDays:  []carbon.Weekday{carbon.Saturday, carbon.Sunday},
	})
	session, err := bot.Start(k, db)
	if err != nil {
		log.Fatalf("Error starting bot: %v", err)
	}
	defer session.Close()

	http.Handle("/metrics", promhttp.Handler())
	go http.ListenAndServe(":2112", nil)

	log.Println("Bot is running. Press CTRL-C to exit.")
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)
	<-stop
}
