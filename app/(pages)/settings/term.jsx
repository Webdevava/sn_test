import React from 'react'

const Term = () => {
  return (
    <section className="px-4 md:px-8" id="FAQ">
      <div className="container mx-auto mb-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Header */}
          <div className="w-full md:w-1/3 text-left">
            <h2 className="text-lg font-bold mt-4 mb-2">
              Terms of Service
            </h2>
            {/* <p className="text-gray-600 text-sm md:text-base">
              Find answers to the most common questions about our product and solutions.
            </p> */}
          </div>
          <div className="w-full md:w-2/3">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-base">1) Introduction</h3>
                <p className='text-xs opacity-75 mt-2'>Welcome to Smart Nominee. By accessing and using our platform, you agree to abide by these Terms & Conditions. Please read them carefully before proceeding.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">2) User Eligibility</h3>
                <p className='text-xs opacity-75 mt-2'>You must be at least 18 years old to use Smart Nominee. By using our services, you confirm that you meet the eligibility criteria.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">3) Account Registration</h3>
                <p className='text-xs opacity-75 mt-2'>To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your login credentials and ensuring the accuracy of your information.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">4) Use of Services</h3>
                <p className='text-xs opacity-75 mt-2'>Smart Nominee allows users to store and manage personal, financial, and insurance details securely. You agree to use our platform responsibly and not for any unlawful activities.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">5) Data Accuracy</h3>
                <p className='text-xs opacity-75 mt-2'>Users are responsible for ensuring that the information entered into Smart Nominee is accurate and up-to-date.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">6) Security & Compliance</h3>
                <p className='text-xs opacity-75 mt-2'>We implement industry-standard security measures to protect user data. However, users are responsible for safeguarding their accounts against unauthorized access.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">7) Termination of Services</h3>
                <p className='text-xs opacity-75 mt-2'>Smart Nominee reserves the right to suspend or terminate your account if you violate these terms or misuse our services.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">8) Limitation of Liability</h3>
                <p className='text-xs opacity-75 mt-2'>Smart Nominee is not liable for any direct or indirect losses resulting from inaccuracies, misuse, or unauthorized access to your account.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-base">9) Changes to Terms</h3>
                <p className='text-xs opacity-75 mt-2'>We may update these Terms & Conditions from time to time. Continued use of our services after modifications implies acceptance of the new terms.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Term