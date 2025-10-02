"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const FaqSection = () => {
  const { t } = useLanguage();

  const faqs = [
    {
      question: "whatIsUttaradhikari",
      answer: "uttaradhikariDescription",
    },
    {
      question: "howSecureIsData",
      answer: "dataSecurityDescription",
    },
    {
      question: "whoCanBeNominee",
      answer: "nomineeDescription",
    },
    {
      question: "whatHappensToAccountHolder",
      answer: "accountHolderEventDescription",
    },
    {
      question: "canUpdateDocuments",
      answer: "updateDocumentsDescription",
    },
    {
      question: "doesCoverLoansAndInsurances",
      answer: "loansAndInsurancesDescription",
    },
    {
      question: "isThereCost",
      answer: "costDescription",
    },
  ];

  return (
    <section className="lg:px-8" id="FAQ">
      <div className="container mx-auto mb-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Header */}
          <div className="w-full md:w-1/3 text-left">
            <h2 className="text-lg font-bold mt-4 mb-2">{t("yourQuestionsAnswered")}</h2>
            <p className="text-gray-600 text-sm md:text-base">{t("faqDescription")}</p>
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
                    {t(faq.question)}
                  </AccordionTrigger>
                  <hr className="translate-y-px" />
                  <AccordionContent className="mt-2 text-sm md:text-base text-gray-600">
                    {t(faq.answer)}
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
            <h2 className="text-lg font-bold mt-4 mb-2">{t("helpAndSupport")}</h2>
            <p className="text-gray-600 text-sm md:text-base">{t("supportDescription")}</p>
          </div>

          {/* Contact Information */}
          <div className="w-full md:w-2/3 flex gap-8">
            <div className="flex gap-2 items-center">
              <Phone />
              <p>{t("supportPhone")}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Mail />
              <p>{t("supportEmail")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;