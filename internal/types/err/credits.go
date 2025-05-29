package err

import "errors"

var (
	ErrInvalidAmount     = errors.New("invalid amount")
	ErrInsufficientFunds = errors.New("insufficient funds")
	ErrBotUser           = errors.New("bot users not allowed")
	ErrNotGuild          = errors.New("credits can only be used in guilds")
	ErrSameUser          = errors.New("the sender and receiver cannot be the same user")
)
