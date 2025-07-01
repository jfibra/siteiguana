export function Footer() {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/site-iguana-logo-new.png" alt="Site Iguana Logo" className="h-10 w-auto" />
            </div>
            <p className="text-gray-600">&copy; {new Date().getFullYear()} Site Iguana. All rights reserved.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="list-none space-y-1">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  About&nbsp;Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Contact&nbsp;Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <p className="text-gray-600">123&nbsp;Main&nbsp;Street</p>
            <p className="text-gray-600">Anytown, CA&nbsp;12345</p>
            <p className="text-gray-600">Email: info@siteiguana.com</p>
            <p className="text-gray-600">Phone: (123)&nbsp;456-7890</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
