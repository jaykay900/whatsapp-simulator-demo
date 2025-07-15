import tkinter as tk
import random

# Create main window
window = tk.Tk()
window.title("WhatsApp Verification Simulation")
window.geometry("400x300")

# Global variables
request_type = random.choice(["user", "attacker"])

def process_response(user_confirmed):
    if request_type == "user" and user_confirmed:
        result = "✔ Code accepted. Proceeding with login..."
    elif request_type == "user" and not user_confirmed:
        result = "⚠ Unexpected response. Treating as suspicious."
    elif request_type == "attacker" and user_confirmed:
        result = "🚨 Warning: Possible social engineering attack!"
    else:
        result = "✅ Code blocked. Hacker attempt prevented!"
    
    result_label.config(text=result)

# Display prompt
prompt = f"A request for a verification code was triggered.\nRequest source: {'YOU' if request_type == 'user' else 'UNKNOWN'}\nDid you request this code?"
label = tk.Label(window, text=prompt, wraplength=350, font=("Helvetica", 12))
label.pack(pady=20)

# Response buttons
yes_button = tk.Button(window, text="Yes, I requested it", command=lambda: process_response(True), bg="green", fg="white")
yes_button.pack(pady=5)

no_button = tk.Button(window, text="No, I didn't request it", command=lambda: process_response(False), bg="red", fg="white")
no_button.pack(pady=5)

# Result display
result_label = tk.Label(window, text="", wraplength=350, font=("Helvetica", 11), fg="blue")
result_label.pack(pady=20)

# Start simulation
window.mainloop()