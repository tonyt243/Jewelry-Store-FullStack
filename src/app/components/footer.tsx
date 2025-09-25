'use client'  

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-column">
          <h3>Store Info</h3>
          <div><strong>Address:</strong></div>
          <div>186-188, Đ. Lê Thánh Tôn, P, Quận 1, Hồ Chí Minh, Vietnam</div>
          <div><strong>Store Hours:</strong></div>
          <div>Monday - Sunday: 9:00 AM - 6:30 PM</div>
          <div><strong>Phone:</strong> +84 903 743 132</div>
          <div><strong>Email:</strong> quochuyta243@gmail.com</div>
          <div>
            <button
              className="follow-button"
              onClick={() =>
                window.open(
                  'https://www.facebook.com/profile.php?id=100066898271984',
                  '_blank'
                )
              }
            >
              💛 Follow Us 💛
            </button>
          </div>
        </div>

        <div className="footer-column">
          <h3>About</h3>
          <div><a href="#">Our Story</a></div>
          <div><a href="#">Contact Us</a></div>
          <div><a href="#">News & Blog</a></div>
          <div><a href="#">Modern Companies</a></div>
          <div><a href="#">Trade Shows & Exhibits</a></div>
        </div>

        <div className="footer-column">
          <h3>Account</h3>
          <div><a href="#">My Account</a></div>
          <div><a href="#">Shopping Cart</a></div>
          <div><a href="#">Track My Order</a></div>
          <div><a href="#">Wholesale Accounts</a></div>
          <div><a href="#">Newsletter Signup</a></div>
        </div>

        <div className="footer-column">
          <h3>Policy</h3>
          <div><a href="#">Privacy Policy</a></div>
          <div><a href="#">Refund Policy</a></div>
          <div><a href="#">Shipping Policy</a></div>
          <div><a href="#">Tree Assembly Guide</a></div>
          <div><a href="#">Terms & Conditions</a></div>
        </div>
      </div>
    </footer>
  )
}
