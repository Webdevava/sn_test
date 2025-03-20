import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Mail, Phone } from "lucide-react";
  
  const FaqSection = () => {
    const faqs = [
      {
        question: "Lorem Ipsum is simply dummy text of the printing?",
        answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
      },
      {
        question: "Lorem Ipsum is simply dummy text of the printing?",
        answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
      },
      {
        question: "Lorem Ipsum is simply dummy text of the printing?",
        answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
      },
      {
        question: "Lorem Ipsum is simply dummy text of the printing?",
        answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
      },
      {
        question: "Lorem Ipsum is simply dummy text of the printing?",
        answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
      },
      {
        question: "Lorem Ipsum is simply dummy text of the printing?",
        answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
      },
      {
        question: "Lorem Ipsum is simply dummy text of the printing?",
        answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
      }
    ];
  
    return (
      <section className="px-4 md:px-8" id="FAQ">
        <div className="container mx-auto mb-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Header */}
            <div className="w-full md:w-1/3 text-left">
              <h2 className="text-lg font-bold mt-4 mb-2">
                Your Questions,Answered
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Find answers to the most common questions about our product and solutions.
              </p>
            </div>
  
            {/* FAQ Accordion */}
            <div className="w-full md:w-2/3">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`} 
                    className="border rounded-lg px-4 data-[state=open]:border-blue-600 transition-colors"
                  >
                    <AccordionTrigger className="text-left text-sm md:text-base py-4 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <hr className="translate-y-px" />
                    <AccordionContent className="mt-2 text-sm md:text-base text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        <hr />
        <div className="container mx-auto mt-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Header */}
            <div className="w-full md:w-1/3 text-left">
              <h2 className="text-lg font-bold mt-4 mb-2">
                Help & Support
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
              You can call or Email to our support team regarding any issue
              </p>
            </div>
  
            {/* FAQ Accordion */}
            <div className="w-full md:w-2/3 flex gap-8">
             <div className="flex gap-2 items-center">
             <Phone/>
             <p>+91 1234567890</p>
             </div>

             <div className="flex gap-2 items-center">
             <Mail/>
             <p>support@smatnominee@gmail.com</p>
             </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default FaqSection;