package config

import (
	"log"
	"strings"

	"github.com/knadh/koanf/parsers/json"
	"github.com/knadh/koanf/providers/env"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
)

var k = koanf.New("/")

// Load retrieves configuration from environment variables.
func Load() *koanf.Koanf {
	if err := k.Load(file.Provider("config.json"), json.Parser()); err != nil {
		log.Fatalf("error loading config: %v", err)
	}
	k.Load(env.Provider("MYVAR_", "/", func(s string) string {
		return strings.Replace(strings.ToLower(
			strings.TrimPrefix(s, "MYVAR_")), "_", "/", -1)
	}), nil)
	return k
}
