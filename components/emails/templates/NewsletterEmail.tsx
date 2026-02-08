import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Text,
    Section,
    Tailwind,
    Img,
    Link,
    Hr,
} from "@react-email/components";
import EmailFooter from "../components/email-footer";
import * as React from 'react';

type NewsletterProps = {
    email: string
};

export const NewsletterEmail = ({
    email
}: NewsletterProps) => {
    return (
        <Html>
            <Head />
            <Preview>Merci pour votre abonnement à notre newsletter !</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#009EE2",
                                offwhite: "#F9FAFB",
                                textPrimary: "#0D0D0E",
                                textSecondary: "#646464",
                            },
                        },
                    },
                }}
            >
                <Body className="bg-offwhite">
                    <Container className="my-10">
                        <Text className="text-sm text-textPrimary">Connect Student</Text>
                        <Text className="text-xl font-semibold text-gray-800 mt-4">
                            📰 Merci de vous être abonné à notre newsletter
                        </Text>
                        <Hr className="my-4" />
                        <Text className="text-base text-gray-700">Bonjour,</Text>
                        <Text className="text-base text-gray-700">
                            Nous avons bien enregistré votre adresse <strong>{email}</strong>{" "}
                            à notre newsletter.
                        </Text>
                        <Text className="text-base text-gray-700">
                            Vous recevrez régulièrement nos actualités, offres de formation et
                            événements.
                        </Text>
                        <Hr className="my-6" />
                        <Text className="text-sm text-gray-500">
                            Si vous n’êtes pas à l’origine de cette inscription, ignorez ce
                            message ou contactez-nous.
                        </Text>
                    </Container>
                    <EmailFooter />
                </Body>
            </Tailwind>
        </Html>
    );
};

export default NewsletterEmail;
