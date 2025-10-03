import tkinter as tk
from tkinter import ttk, messagebox

class FishingHelperApp(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("🎣 Fishing Helper")
        self.geometry("600x400")
        self.configure(bg="#e6f2ff")

        # Title Label
        title = tk.Label(self, text="Fishing Helper App", font=("Arial", 20, "bold"), bg="#e6f2ff", fg="#004080")
        title.pack(pady=10)

        # Tabs
        tab_control = ttk.Notebook(self)

        self.log_tab = ttk.Frame(tab_control)
        self.weather_tab = ttk.Frame(tab_control)
        self.stats_tab = ttk.Frame(tab_control)

        tab_control.add(self.log_tab, text="Log Catch")
        tab_control.add(self.weather_tab, text="Weather")
        tab_control.add(self.stats_tab, text="Stats")
        tab_control.pack(expand=1, fill="both")

        # Build Tabs
        self.build_log_tab()
        self.build_weather_tab()
        self.build_stats_tab()

    def build_log_tab(self):
        # Labels and Entry fields
        tk.Label(self.log_tab, text="Species:").grid(row=0, column=0, padx=10, pady=5, sticky="w")
        self.species_entry = tk.Entry(self.log_tab, width=30)
        self.species_entry.grid(row=0, column=1, padx=10, pady=5)

        tk.Label(self.log_tab, text="Weight (kg):").grid(row=1, column=0, padx=10, pady=5, sticky="w")
        self.weight_entry = tk.Entry(self.log_tab, width=30)
        self.weight_entry.grid(row=1, column=1, padx=10, pady=5)

        tk.Label(self.log_tab, text="Bait Used:").grid(row=2, column=0, padx=10, pady=5, sticky="w")
        self.bait_entry = tk.Entry(self.log_tab, width=30)
        self.bait_entry.grid(row=2, column=1, padx=10, pady=5)

        tk.Label(self.log_tab, text="Location:").grid(row=3, column=0, padx=10, pady=5, sticky="w")
        self.location_entry = tk.Entry(self.log_tab, width=30)
        self.location_entry.grid(row=3, column=1, padx=10, pady=5)

        tk.Button(self.log_tab, text="Save Catch", command=self.save_catch, bg="#004080", fg="white").grid(row=4, column=1, pady=10)

    def build_weather_tab(self):
        tk.Label(self.weather_tab, text="(Future Feature) Show local weather and tides here!", font=("Arial", 12)).pack(pady=20)

    def build_stats_tab(self):
        tk.Label(self.stats_tab, text="(Future Feature) Display fishing stats and charts here!", font=("Arial", 12)).pack(pady=20)

    def save_catch(self):
        species = self.species_entry.get()
        weight = self.weight_entry.get()
        bait = self.bait_entry.get()
        location = self.location_entry.get()

        if species and weight and bait and location:
            messagebox.showinfo("Catch Saved", f"Logged: {species} ({weight}kg) using {bait} at {location}")
            # Clear inputs
            self.species_entry.delete(0, tk.END)
            self.weight_entry.delete(0, tk.END)
            self.bait_entry.delete(0, tk.END)
            self.location_entry.delete(0, tk.END)
        else:
            messagebox.showwarning("Missing Data", "Please fill in all fields!")

if __name__ == "__main__":
    app = FishingHelperApp()
    app.mainloop()
