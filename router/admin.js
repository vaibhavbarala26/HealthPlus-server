const router = require("express");
const jwt = require("jsonwebtoken"); // Ensure this is required
const adminRouter = router();

adminRouter.post("/admin", async (req, res) => {
    const { name, phone, password } = req.body;

    // Simple hardcoded admin credentials check
    if (name === "admin" && phone === "+919889385255" && password === "123456") {
        
        // Clear any existing admin token cookie before generating a new one
        res.clearCookie("tokens", { path: "/", domain: "localhost", httpOnly: true });

        // Set token expiration to 7 days
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        // Payload to be included in the JWT
        const payload = { name, phone };

        // Sign the token with a secret key and set expiration
        const admintoken = jwt.sign(payload, "26020451202", { expiresIn: '7d' });

        // Set the signed token in an HTTP-only cookie
        res.cookie("tokens", admintoken, { 
            path: "/", 
            domain: "localhost", 
            httpOnly: true, 
            expires // Include expiration time in the cookie
        });

        return res.status(200).json("Login successful");
    } else {
        return res.status(401).json({ msg: "Invalid credentials" });
    }
});

module.exports = adminRouter;
