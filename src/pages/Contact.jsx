import React from 'react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-bg pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl serif font-bold text-text mb-6">Contact Us</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Get in touch with our team. We're here to help you scale your business and answer any questions you might have.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left Column: Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl serif font-semibold text-text mb-4">Our Headquarters</h3>
              <p className="text-text-secondary leading-relaxed">
                123 Innovation Drive<br />
                Suite 400<br />
                San Francisco, CA 94103<br />
                United States
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl serif font-semibold text-text mb-4">Contact Information</h3>
              <div className="space-y-2 text-text-secondary">
                <p>Email: hello@webloom.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl serif font-semibold text-text mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-text-secondary hover:text-primary transition-colors">LinkedIn</a>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors">Twitter</a>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors">Instagram</a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-surface border border-border rounded-[8px] p-[24px] md:p-8">
            <h3 className="text-2xl serif font-semibold text-text mb-6">Send us a message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text mb-2">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full bg-bg border border-border rounded-[8px] px-4 py-3 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Jane Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-bg border border-border rounded-[8px] px-4 py-3 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="jane@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full bg-bg border border-border rounded-[8px] px-4 py-3 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gold hover:bg-gold-light text-[#201607] font-semibold py-3 px-6 rounded-[8px] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
