import {
  PortableText,
  type PortableTextComponents
} from 'next-sanity'
import s from './CustomPortableTextPages.module.css'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../shadcn/ui/accordion'

export function CustomPortableTextPages({
  paragraphClasses,
  value
}: {
  paragraphClasses?: string
  value: any[]
}) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => {
        return <p className={paragraphClasses}>{children}</p>
      },
      h1: ({ children }) => (
        <h1 className="text-center pt-8 text-xl font-semibold ">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-center pt-8 text-lg font-semibold ">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-center pt-8 text-base font-semibold ">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-center pt-8 text-base font-semibold ">
          {children}
        </h4>
      ),
      h5: ({ children }) => (
        <h5 className="text-center pt-8 text-base font-semibold ">
          {children}
        </h5>
      )
    },

    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside py-4 text-sm">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside py-4 text-sm">{children}</ol>
      )
    },
    listItem: {
      bullet: ({ children }) => <li className="mb-2">{children}</li>,
      number: ({ children }) => <li className="mb-2">{children}</li>
    },
    marks: {
      link: ({ children, value }) => {
        return (
          <a
            className="underline transition hover:opacity-50"
            href={value?.href}
            rel="noreferrer noopener"
          >
            {children}
          </a>
        )
      }
    },
    types: {
      mainBody: ({ value }) => {
        return (
          <div className={`post-content space-y-5 `}>
            <PortableText value={value.body} components={components} />
          </div>
        )
      },
      faq: ({ value }) => {
        return (
          <Accordion
            type="single"
            collapsible
            className="divide-y divide-muted-foreground"
          >
            {/* @ts-ignore */}
            {value.faqItems.map((faqItem, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="px-4 py-4 lg:py-8 w-full md:w-3/4 mx-auto "
              >
                <AccordionTrigger className="font-semibold ">
                  {faqItem.question}
                </AccordionTrigger>
                <AccordionContent className={`${s.linkhighlight}`}>
                  <PortableText value={faqItem.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )
      }
    }
  }

  return <PortableText components={components} value={value} />
}
