extends Node

var coins: int = 1500
var rewards := [50, 80, 120, 200, 300, 500, 700, 1000]

@onready var coin_label = $UI/CoinLabel
@onready var result_label = $UI/ResultLabel

func _ready() -> void:
	_update_ui()

func spin_wheel() -> void:
	if coins < 50:
		result_label.text = "Koin tidak cukup."
		return

	coins -= 50
	var reward = rewards[randi() % rewards.size()]
	coins += reward
	result_label.text = "Wheel reward: +%d" % reward
	_update_ui()

func buy_jackpot_ticket() -> void:
	if coins < 100:
		result_label.text = "Koin kurang untuk tiket."
		return

	coins -= 100
	result_label.text = "Tiket jackpot dibeli."
	_update_ui()

func claim_daily_reward(streak: int) -> void:
	var bonus = 100 + (streak * 25)
	coins += bonus
	result_label.text = "Daily reward +%d" % bonus
	_update_ui()

func _update_ui() -> void:
	coin_label.text = str(coins)
