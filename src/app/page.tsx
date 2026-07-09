'use client';

import styled from 'styled-components';
import Link from 'next/link';
import Header from '@/components/Header';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

const Hero = styled.section`
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
  padding: 80px 24px 120px;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: #e8f4ff;
  color: #0070f3;
  font-size: 13px;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 24px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(36px, 6vw, 56px);
  font-weight: 700;
  color: #000000;
  margin: 0 0 24px 0;
  letter-spacing: -1.5px;
  line-height: 1.1;
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: #666666;
  margin: 0 0 40px 0;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 16px 32px;
  background: #000000;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #333333;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 16px 32px;
  background: #ffffff;
  color: #000000;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid #eaeaea;
  transition: all 0.2s;

  &:hover {
    border-color: #000000;
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  text-align: center;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
`;

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: #666666;
  text-align: center;
  margin: 0 0 48px 0;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
`;

const FeatureCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 12px 0;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
  line-height: 1.6;
`;

const CTASection = styled.section`
  padding: 80px 24px;
  background: #000000;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px 0;
`;

const CTAText = styled.p`
  font-size: 16px;
  color: #999999;
  margin: 0 0 32px 0;
`;

const CTAButtonLight = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 16px 32px;
  background: #ffffff;
  color: #000000;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  }
`;

const Footer = styled.footer`
  padding: 32px 24px;
  background: #fafafa;
  border-top: 1px solid #eaeaea;
  text-align: center;
`;

const FooterText = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

const FooterLogo = styled.span`
  font-weight: 600;
  color: #000000;
`;

export default function LandingPage() {
  return (
    <PageWrapper>
      <Header />

      <Hero>
        <HeroContent>
          <Badge>Simple, Transparent Hosting</Badge>
          <HeroTitle>
            Deploy your web projects with confidence
          </HeroTitle>
          <HeroSubtitle>
            Fast, reliable hosting with transparent pricing. No hidden fees,
            no surprises. Just the tools you need to ship your projects.
          </HeroSubtitle>
          <CTAButtons>
            <PrimaryButton href="/pricing">View Plans</PrimaryButton>
            <SecondaryButton href="/register">Get Started</SecondaryButton>
          </CTAButtons>
        </HeroContent>
      </Hero>

      <FeaturesSection>
        <SectionTitle>Everything you need to ship</SectionTitle>
        <SectionSubtitle>Built for developers who value simplicity and performance</SectionSubtitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Instant Deployments</FeatureTitle>
            <FeatureDescription>
              Push to deploy. Your changes go live in seconds with automatic
              builds and zero-downtime deployments.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Free SSL Certificates</FeatureTitle>
            <FeatureDescription>
              Every deployment comes with automatic HTTPS. Keep your users
              safe with industry-standard encryption.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🌍</FeatureIcon>
            <FeatureTitle>Global CDN</FeatureTitle>
            <FeatureDescription>
              Your content is served from edge locations worldwide.
              Fast load times for users everywhere.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Real-time Analytics</FeatureTitle>
            <FeatureDescription>
              Understand your traffic with built-in analytics. No third-party
              scripts slowing down your site.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🔄</FeatureIcon>
            <FeatureTitle>Preview Deployments</FeatureTitle>
            <FeatureDescription>
              Every pull request gets its own preview URL. Review changes
              before they hit production.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🛠️</FeatureIcon>
            <FeatureTitle>Serverless Functions</FeatureTitle>
            <FeatureDescription>
              Run backend code without managing servers. Scale automatically
              with your traffic.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <CTASection>
        <CTATitle>Ready to get started?</CTATitle>
        <CTAText>Choose a plan that works for you. Cancel anytime.</CTAText>
        <CTAButtonLight href="/pricing">View Pricing</CTAButtonLight>
      </CTASection>

      <Footer>
        <FooterText>
          © 2024 <FooterLogo>VerceI</FooterLogo>. All rights reserved.
        </FooterText>
      </Footer>
    </PageWrapper>
  );
}
