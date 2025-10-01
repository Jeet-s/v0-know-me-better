export const questions = [
  // Food & Dining
  "What's your favorite comfort food?",
  "What's your go-to coffee or tea order?",
  "What's one food you could eat every day?",
  "What's your favorite restaurant or cuisine?",
  "Sweet or savory snacks?",
  "What's your ideal breakfast?",
  "What's a food you absolutely can't stand?",
  "What's your favorite dessert?",
  "Do you prefer cooking at home or eating out?",
  "What's your favorite pizza topping?",

  // Entertainment & Media
  "What's your favorite movie of all time?",
  "What's your favorite TV show?",
  "What's your favorite music genre?",
  "Who's your favorite artist or band?",
  "What's the last song you had stuck in your head?",
  "What's your favorite book or book genre?",
  "What's your favorite way to spend a lazy Sunday?",
  "What's a movie that always makes you cry?",
  "What's a movie that always makes you laugh?",
  "What's your guilty pleasure TV show?",

  // Lifestyle & Preferences
  "Are you a morning person or a night owl?",
  "What's your ideal way to relax after a long day?",
  "What's your favorite season?",
  "Beach vacation or mountain getaway?",
  "What's your favorite holiday?",
  "What's your favorite color?",
  "Do you prefer hot or cold weather?",
  "What's your favorite type of weather?",
  "What's your favorite day of the week?",
  "What's your favorite time of day?",

  // Love & Relationships
  "What's your love language?",
  "What's your ideal date night?",
  "What's the most romantic gesture someone could do for you?",
  "What's your favorite thing about our relationship?",
  "What's one thing you appreciate most about me?",
  "What's your favorite memory of us together?",
  "What's one thing that always makes you think of me?",
  "What's your favorite way to show affection?",
  "What's your dream couple's activity?",
  "What makes you feel most loved?",

  // Friends & Social
  "What's your ideal Friday night with friends?",
  "What's your favorite party game?",
  "What's your go-to karaoke song?",
  "What's your favorite way to celebrate a birthday?",
  "What's your favorite social media platform?",
  "What's your texting style - emojis or words?",
  "What's your favorite type of humor?",
  "What's your ideal way to meet new people?",
  "What's your favorite thing to do at a party?",
  "How do you prefer to communicate with friends?",

  // Travel & Adventure
  "What's your dream vacation destination?",
  "What's the best trip you've ever taken?",
  "Would you rather travel to the past or the future?",
  "What's your favorite mode of transportation?",
  "What's one place you'd love to visit together?",
  "What's your travel style - planned or spontaneous?",
  "What's your favorite souvenir to bring back from trips?",
  "What's your dream adventure activity?",
  "City exploration or nature retreat?",
  "What's your ideal vacation length?",

  // Quirks & Random
  "What's your biggest pet peeve?",
  "What's your hidden talent?",
  "What's your most irrational fear?",
  "What's your go-to dance move?",
  "What's your spirit animal?",
  "What's your favorite emoji?",
  "What's your weirdest habit?",
  "What's your favorite smell?",
  "What's your lucky number?",
  "What's your favorite way to procrastinate?",

  // Memories & Nostalgia
  "What's your favorite childhood memory?",
  "What's your favorite memory from high school?",
  "What's your favorite family tradition?",
  "What's your favorite childhood TV show?",
  "What's your favorite childhood snack?",
  "What's your favorite childhood game?",
  "What's your favorite memory with your best friend?",
  "What's your favorite birthday you've ever had?",
  "What's your favorite holiday memory?",
  "What's your first concert or live event memory?",
]

export function getRandomQuestions(count = 5): string[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
