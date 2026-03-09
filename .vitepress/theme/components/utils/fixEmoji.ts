const fixEmoji = (fix: string) => {
  switch (fix) {
    case "fixable_fix":
    case "conditional_fix":
      return "🛠️";
    case "fixable_suggestion":
    case "conditional_suggestion":
      return "💡";
    case "fixable_dangerous_fix":
    case "conditional_dangerous_fix":
      return "⚠️ 🛠️";
    case "fixable_dangerous_suggestion":
    case "conditional_dangerous_suggestion":
      return "⚠️ 💡";
    case "conditional_safe_fix_or_suggestion":
    case "fixable_safe_fix_or_suggestion":
      return "🛠️ 💡";
    case "fixable_dangerous_fix_or_suggestion":
    case "conditional_dangerous_fix_or_suggestion":
      return "⚠️ 🛠 💡";
    case "pending":
      return "🚧";
    case "none":
    default:
      return "";
  }
};

export default fixEmoji;
