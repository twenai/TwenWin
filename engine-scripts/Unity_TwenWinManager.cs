using UnityEngine;
using TMPro;

public class UnityTwenWinManager : MonoBehaviour
{
    public TMP_Text coinLabel;
    public TMP_Text resultLabel;
    public int coins = 1500;

    public void SpinWheel()
    {
        if (coins < 50)
        {
            resultLabel.text = "Koin tidak cukup.";
            return;
        }

        coins -= 50;
        int[] rewards = { 50, 80, 120, 200, 300, 500, 700, 1000 };
        int reward = rewards[Random.Range(0, rewards.Length)];
        coins += reward;

        resultLabel.text = $"Wheel reward: +{reward}";
        UpdateUI();
    }

    public void BuyJackpotTicket()
    {
        if (coins < 100)
        {
            resultLabel.text = "Koin kurang untuk tiket.";
            return;
        }

        coins -= 100;
        resultLabel.text = "Tiket jackpot dibeli.";
        UpdateUI();
    }

    public void ClaimDailyReward(int streak)
    {
        int bonus = 100 + (streak * 25);
        coins += bonus;
        resultLabel.text = $"Daily reward +{bonus}";
        UpdateUI();
    }

    void UpdateUI()
    {
        coinLabel.text = $"{coins}";
    }
}
