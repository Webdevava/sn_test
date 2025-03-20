import React from 'react'

const Policy = () => {
  return (
    <section className="px-4 md:px-8" id="FAQ">
      <div className="container mx-auto mb-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Header */}
          <div className="w-full md:w-1/3 text-left">
            <h2 className="text-lg font-bold mt-4 mb-2">
              Privacy Policy
            </h2>
            {/* <p className="text-gray-600 text-sm md:text-base">
              Find answers to the most common questions about our product and solutions.
            </p> */}
          </div>
          <div className="w-full md:w-2/3">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-base">1) Data Collection</h3>
                <p className='text-xs opacity-75 mt-2'>We collect user information, including personal, financial, and insurance details, to provide a seamless experience. This data is stored securely and used solely for the intended purpose.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">2) Use of Data</h3>
                <p className='text-xs opacity-75 mt-2'>Your data is used to personalize your dashboard, enhance security, and improve service functionality. We do not sell or share your data with third parties without consent.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">3) Data Protection</h3>
                <p className='text-xs opacity-75 mt-2'>We employ encryption and other security measures to safeguard user information from unauthorized access.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">4) Third-Party Services</h3>
                <p className='text-xs opacity-75 mt-2'>Smart Nominee may integrate with third-party services for added functionalities. Users are advised to review the privacy policies of these third parties before sharing information.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">5) Cookies & Tracking</h3>
                <p className='text-xs opacity-75 mt-2'>We use cookies and tracking technologies to enhance user experience and analyze platform performance. You can manage cookie preferences through your browser settings.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">6) User Rights</h3>
                <p className='text-xs opacity-75 mt-2'>Users can request access, correction, or deletion of their data by contacting us. We strive to comply with data protection laws applicable in your region.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">7) Policy Updates</h3>
                <p className='text-xs opacity-75 mt-2'>Smart Nominee may revise this Privacy Policy from time to time. Users will be notified of significant changes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Policy