export function Footer() {
  return (
    <footer className="bg-cyber-darker border-t border-neon-green/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-cyber font-bold">
                XP<span className="text-neon-green">Beats</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Premium cyberpunk beats for the future of music.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/beats" className="hover:text-neon-green">All Beats</a></li>
              <li><a href="/free" className="hover:text-neon-green">Free Downloads</a></li>
              <li><a href="/licensing" className="hover:text-neon-green">Licensing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/contact" className="hover:text-neon-green">Contact</a></li>
              <li><a href="/faq" className="hover:text-neon-green">FAQ</a></li>
              <li><a href="/terms" className="hover:text-neon-green">Terms</a></li>
              <li><a href="/privacy" className="hover:text-neon-green">Privacy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-neon-green">Instagram</a></li>
              <li><a href="#" className="hover:text-neon-green">Twitter</a></li>
              <li><a href="#" className="hover:text-neon-green">YouTube</a></li>
              <li><a href="#" className="hover:text-neon-green">SoundCloud</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cyber-light mt-8 pt-8 text-center text-sm text-gray-500">
          © 2024 XP Beats. All rights reserved.
        </div>
      </div>
    </footer>
  )
}