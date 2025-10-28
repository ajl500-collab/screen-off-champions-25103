import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { COPY } from "@/lib/copy";

export const FAQAccordion = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {COPY.pricing.faq.questions.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left text-foreground hover:text-primary">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
