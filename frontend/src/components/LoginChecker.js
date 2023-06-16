export function isLoggedIn() {
    const token = localStorage.getItem("user");
    if (!token) {
        window.location.href = "/login"; // redirect to login page
        return false;
    }
    return true;
}
