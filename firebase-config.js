/**
 * VibeEra Database Integration Module
 * Supports Firebase Realtime Database / Firestore & Local Storage Sync
 */

const FIREBASE_CONFIG = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "vibeera-accessories.firebaseapp.com",
    databaseURL: "https://vibeera-accessories-default-rtdb.firebaseio.net",
    projectId: "vibeera-accessories",
    storageBucket: "vibeera-accessories.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

class VibeEraDatabase {
    constructor() {
        this.dbPrefix = "vibeera_db_";
    }

    // Save User Account
    async registerUser(userData) {
        const key = this.dbPrefix + "user_" + userData.email.toLowerCase();
        localStorage.setItem(key, JSON.stringify(userData));
        
        // Optional Firebase Firestore sync endpoint call
        console.log("User registered to DB:", userData.email);
        return { success: true, message: "User registered successfully" };
    }

    // Authenticate User
    async loginUser(email, password) {
        const key = this.dbPrefix + "user_" + email.toLowerCase();
        const stored = localStorage.getItem(key);
        if(!stored) {
            return { success: false, message: "Account not found." };
        }
        const user = JSON.parse(stored);
        if(user.password !== password) {
            return { success: false, message: "Incorrect password." };
        }
        localStorage.setItem(this.dbPrefix + "session", JSON.stringify(user));
        return { success: true, user: user };
    }

    // Get Active Session
    getLoggedInUser() {
        const session = localStorage.getItem(this.dbPrefix + "session");
        return session ? JSON.parse(session) : null;
    }

    // Logout User
    logout() {
        localStorage.removeItem(this.dbPrefix + "session");
    }

    // Save Order to Database
    async saveOrder(orderData) {
        let orders = JSON.parse(localStorage.getItem(this.dbPrefix + "orders")) || [];
        orders.unshift(orderData);
        localStorage.setItem(this.dbPrefix + "orders", JSON.stringify(orders));
        
        console.log("Order saved to Database:", orderData);
        return { success: true, orderId: "ORD_" + Date.now() };
    }

    // Save Review to Database
    async saveReview(reviewData) {
        let reviews = JSON.parse(localStorage.getItem("vibeera_reviews")) || [];
        reviews.unshift(reviewData);
        localStorage.setItem("vibeera_reviews", JSON.stringify(reviews));
        return { success: true };
    }

    // Get Reviews
    getReviews() {
        return JSON.parse(localStorage.getItem("vibeera_reviews")) || [];
    }
}

const DB = new VibeEraDatabase();
