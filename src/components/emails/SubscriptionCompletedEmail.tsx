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
  Text
} from '@react-email/components'

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://lc-local-development.vercel.app'

const SubscriptionCompletedEmail = (
  userEmail: string,
  userName: string | null | undefined
) => {
  return (
    <Html>
      <Head />
      <Preview>Your subscription is up and running.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={message}>
            <Text style={global.text}>
              Dear {userName ? `${userName},` : `${userEmail},`}
            </Text>
            <Text style={{ ...global.text, marginTop: 20 }}>
              We are delighted to welcome you to Lux Cache, a platform dedicated
              to providing innovative tools, insights, and support in music
              production.
            </Text>
            <Text style={{ ...global.text, marginTop: 20 }}>
              At Lux Cache, we collaborate with pioneering artists and producers
              to offer an unparalleled array of resources. Our commissioned
              articles, presentations, sample packs, features, and tutorials are
              designed to foster creativity and enhance your musical journey.
            </Text>
            <Text style={{ ...global.text, marginTop: 20 }}>
              We invite you to start exploring our platform and begin
              participating in our vibrant Discord community. Visit{' '}
              <Link style={anchor} href="https://luxcache.com">
                LUXCACHE.COM
              </Link>{' '}
              to start exploring our resources and connect with like-minded
              innovators on our Discord server.
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

export default SubscriptionCompletedEmail

const paddingX = {
  paddingLeft: '20px',
  paddingRight: '20px'
}

const paddingY = {
  paddingTop: '22px',
  paddingBottom: '22px'
}

const paragraph = {
  margin: '0',
  lineHeight: '2'
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
    fontWeight: '500',
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
  margin: '10px auto',
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
  paddingTop: '30px',
  paddingBottom: '40px',
  textAlign: 'center'
} as React.CSSProperties

const adressTitle = {
  ...paragraph,
  fontSize: '15px',
  fontWeight: 'bold'
}

const footer = {
  policy: {
    width: '166px',
    margin: 'auto'
  },
  text: {
    ...paddingX,
    margin: '0',
    color: '#AFAFAF',
    fontSize: '13px',
    textAlign: 'center'
  } as React.CSSProperties
}
