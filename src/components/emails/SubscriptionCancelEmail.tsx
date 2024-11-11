import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Link,
  Section,
  Text,
  Img
} from '@react-email/components'

import Logo from '@/components/icons/Logo'

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://lc-local-development.vercel.app'

const SubscriptionCancelEmail = (
  userEmail: string,
  userName: string | null | undefined
) => {
  return (
    <Html>
      <Head />
      <Preview>💟 Confirming the end of your Lux Cache Subscription</Preview>
      <Body style={main}>
        <Link href="https://luxcache.com">
          <Logo
            width="120"
            height="80"
            alt="Lux Cache"
            style={{ margin: '0 auto', display: 'block' }}
          />
        </Link>

        <Container style={container}>
          <Section style={message}>
            <Text style={global.text}>
              Dear {userName ? `${userName},` : `${userEmail},`}
            </Text>
            <Text style={{ ...global.text, marginTop: 20 }}>
              We’re sorry to see you go and hope that your time subscribed to
              Lux Cache has been both enriching and inspiring. Your presence and
              contributions to our community have been greatly valued, and we
              sincerely thank you for being part of the platform.
            </Text>
            <Text style={{ ...global.text, marginTop: 20 }}>
              We are committed to continuous improvement and would greatly
              appreciate any feedback you could provide about your experience.
              Your insights are invaluable to us and can help enhance our
              platform for all members.
            </Text>
            <Text style={{ ...global.text, marginTop: 20 }}>
              Please take a moment to share your thoughts through our{' '}
              <Link style={anchor} href="https://luxcache.com">
                feedback form
              </Link>
              .
            </Text>
            <Text style={{ ...global.text, marginTop: 20 }}>
              We hope our paths cross again in the future. Feel free to continue
              connecting with people in the Lux Cache Discord community and we
              hope to see you again another time.
            </Text>
            <Text style={{ ...global.text, marginTop: 20 }}>
              Thank you again for being part of Lux Cache!
            </Text>
            <Text style={{ ...global.text, marginTop: 20 }}>
              Best regards,
              <br /> Lux Cache Staff
            </Text>
          </Section>
          <Hr style={global.hr}></Hr>
          <Section>
            <Row>
              <Text
                style={{ ...footer.text, paddingTop: 10, paddingBottom: 10 }}
              >
                Want to pitch us a guest or collaboration? → Email or DM us
                <br />
                This email was sent to {`${userEmail}`}
                <br />
                <Link href="https://luxcache.com/account">
                  Manage your email settings
                </Link>
                <br />
                Forwarded this email?{' '}
                <Link href="https://luxcache.com">Subscribe here</Link> for more
              </Text>
            </Row>
            <Row>
              <Text style={{ ...footer.text, paddingBottom: 10 }}>
                © LuxCache
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default SubscriptionCancelEmail

const paddingX = {
  paddingLeft: '40px',
  paddingRight: '40px'
}

const paddingY = {
  paddingTop: '22px',
  paddingBottom: '22px'
}

const paragraph = {
  margin: '0',
  lineHeight: '2',
  fontSize: '16px'
}

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY
  },
  paragraphWithBold: { ...paragraph, fontWeight: 'bold' },
  heading: {
    fontSize: '16px',
    lineHeight: '1.3',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '0px'
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: 'black',
    // fontWeight: '500',
    lineHeight: '1.4'
  },
  button: {
    border: '1px solid #929292',
    fontSize: '16px',
    textDecoration: 'none',
    padding: '10px 0px',
    width: '220px',
    display: 'block',
    textAlign: 'center',
    fontWeight: 500,
    color: '#000'
  } as React.CSSProperties,
  hr: {
    borderColor: '#E5E5E5',
    margin: '0'
  }
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
}

const container = {
  margin: '10px auto 40px auto',
  width: '600px',
  maxWidth: '100%',
  border: '1px solid #E5E5E5'
}

const anchor = {
  textDecoration: 'underline',
  color: '#000',
  fontWeight: '500',
  fontStyle: 'italic'
}

const message = {
  ...paddingX,
  paddingTop: '40px',
  paddingBottom: '40px',
  textAlign: 'left'
} as React.CSSProperties

const footer = {
  policy: {
    width: '166px',
    margin: 'auto'
  },
  text: {
    ...paddingX,
    margin: '0',
    color: '#525252',
    fontSize: '13px',
    textAlign: 'center'
  } as React.CSSProperties
}
