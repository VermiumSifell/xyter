package database

import (
	"time"

	"github.com/knadh/koanf/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Guild struct {
	ID        string `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time

	GuildMembers         []GuildMember
	GuildSettings        *GuildSettings
	GuildCreditsSettings *GuildCreditsSettings `gorm:"foreignKey:GuildID;references:ID"`
	GuildQuotesSettings  *GuildQuotesSettings  `gorm:"foreignKey:GuildID;references:ID"`
	Cooldowns            []Cooldown
	Quotes               []Quote
}

type User struct {
	ID           string `gorm:"primaryKey"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	GuildMembers []GuildMember
	cooldowns    []Cooldown

	userReputation *UserReputation `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
	Qutoes         []Quote         `gorm:"many2many:quotes;"`
	PostedQutoes   []Quote         `gorm:"many2many:posted_quotes;"`
}

type GuildMember struct {
	GuildID   string    `gorm:"primaryKey"`
	UserID    string    `gorm:"primaryKey"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	Guild Guild `gorm:"foreignKey:GuildID;references:ID;constraint:OnDelete:CASCADE"`
	User  User  `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`

	GuildMemberCredit *GuildMemberCredit `gorm:"foreignKey:GuildID,UserID;references:GuildID,UserID"`

	Cooldowns []Cooldown `gorm:"foreignKey:GuildID,UserID;references:GuildID,UserID"`
}

type GuildMemberCredit struct {
	GuildID   string    `gorm:"primaryKey;index;index:guild_user_idx,unique;index:guild_idx;index:user_idx"`
	UserID    string    `gorm:"primaryKey;index;index:guild_user_idx,unique;index:user_idx;index:guild_user_comp_idx"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	Balance int `gorm:"default:0"`
}

type UserReputation struct {
	UserID    string    `gorm:"primaryKey;unique"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	Negative int  `gorm:"default:0"`
	Positive int  `gorm:"default:0"`
	User     User `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
}

type GuildSettings struct {
	ID        string    `gorm:"primaryKey;unique"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	GuildID string `gorm:"index"`

	GuildCreditsSettingsID *string
	GuildCreditsSettings   *GuildCreditsSettings `gorm:"constraint:OnDelete:CASCADE;foreignKey:GuildCreditsSettingsID;references:ID"`

	GuildQuotesSettingsID *string
	GuildQuotesSettings   *GuildQuotesSettings `gorm:"foreignKey:GuildQuotesSettingsID;references:ID"`
}

type GuildCreditsSettings struct {
	ID        string    `gorm:"primaryKey;unique"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	GuildID string `gorm:"uniqueIndex"`

	// Settings
	WorkBonusChance   int `gorm:"default:30"`
	WorkPenaltyChance int `gorm:"default:10"`

	DailyBonusAmount   int `gorm:"default:25"`
	WeeklyBonusAmount  int `gorm:"default:50"`
	MonthlyBonusAmount int `gorm:"default:150"`
}

type GuildQuotesSettings struct {
	ID        string    `gorm:"primaryKey;unique"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	GuildID string

	Status         bool `gorm:"default:false"`
	QuoteChannelID string
}

type Quote struct {
	ID        string    `gorm:"primaryKey;default:uuid_generate_v4()"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	UserID string
	User   User `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`

	GuildID string
	Guild   Guild `gorm:"foreignKey:GuildID;references:ID;constraint:OnDelete:CASCADE"`

	Message string

	PosterUserID string
	PosterUser   User `gorm:"foreignKey:PosterUserID;references:ID"`
}

type Cooldown struct {
	ID        string    `gorm:"primaryKey;default:uuid_generate_v4()"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`

	ExpiresAt    time.Time
	CooldownItem string

	// Optional foreign keys
	GuildID *string
	Guild   *Guild `gorm:"foreignKey:GuildID;references:ID;constraint:OnDelete:CASCADE"`

	UserID *string
	User   *User `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`

	// Optional composite foreign key to GuildMember
}

func Open(k *koanf.Koanf) *gorm.DB {
	db, err := gorm.Open(postgres.Open(k.String("database/url")), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	return db
}

func Migrate(db *gorm.DB) {
	db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
	db.AutoMigrate(
		&Guild{},
		&UserReputation{},
		&User{},
		&GuildMember{},
		&GuildMemberCredit{},
		&GuildSettings{},
		&GuildCreditsSettings{},
		&GuildQuotesSettings{},
		&Quote{},
		&Cooldown{},
	)
}
