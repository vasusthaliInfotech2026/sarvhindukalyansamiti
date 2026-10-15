module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        saffron: { DEFAULT: "#E8751A", light: "#FF9933", deep: "#C85A00" },
        navy: { DEFAULT: "#14264D", dark: "#0B1830" },
        cream: "#FFF8EE", sandal: "#FBE9D0", gold: "#C9962B", leaf: "#2E7D4F",
      },
      fontFamily: { body: ["var(--font-body)", "sans-serif"], head: ["var(--font-head)", "serif"] },
      keyframes: {
        rise: { "0%": { opacity: 0, transform: "translateY(22px)" }, "100%": { opacity: 1, transform: "none" } },
        kenburns: { "0%": { transform: "scale(1)" }, "100%": { transform: "scale(1.14)" } },
        spinSlow: { to: { transform: "rotate(360deg)" } },
        ring: { "0%": { boxShadow: "0 0 0 0 rgba(232,117,26,.6)" }, "70%": { boxShadow: "0 0 0 12px rgba(232,117,26,0)" }, "100%": { boxShadow: "0 0 0 0 rgba(232,117,26,0)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: {
        rise: "rise .8s ease-out both", kenburns: "kenburns 9s ease-out both",
        "spin-slow": "spinSlow 60s linear infinite", ring: "ring 2s infinite", marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};
