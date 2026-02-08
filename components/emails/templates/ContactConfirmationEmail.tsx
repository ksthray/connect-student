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
} from "@react-email/components";
import EmailFooter from "../components/email-footer";

type ContactConfirmationProps = {
    fullname: string;
    messageSummary?: string;
};

export const ContactConfirmationEmail = ({ fullname, messageSummary }: ContactConfirmationProps) => {
    return (
        <Html>
            <Head />
            <Preview>Nous avons bien reçu votre message sur Connect Student.</Preview>
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
                    <Container className="max-w-2xl mx-auto">
                        <Section className="text-center py-10">
                            <Img
                                src="https://res.cloudinary.com/kinshasa-3d/image/upload/v1770456351/connect-student-logo_hfrsla.png"
                                width="150"
                                height="auto"
                                alt="Connect Student"
                                className="mx-auto my-10"
                            />
                        </Section>
                        <Section className="bg-white p-10 rounded-lg shadow-sm">
                            <Text className="text-textPrimary text-lg font-semibold capitalize">Bonjour {fullname},</Text>
                            <Text className="text-textSecondary text-sm mb-6">
                                Merci de nous avoir contactés. Nous avons bien reçu votre message.
                            </Text>
                            {messageSummary && (
                                <Section className="bg-offwhite p-4 rounded-md mb-6">
                                    <Text className="text-textSecondary text-sm italic">
                                        "{messageSummary}"
                                    </Text>
                                </Section>
                            )}
                            <Text className="text-textSecondary text-sm">
                                Notre équipe étudiera votre demande et reviendra vers vous dans les plus brefs délais.
                            </Text>
                        </Section>
                        <Section className="text-center py-10">
                            <Text className="text-textSecondary text-sm">
                                Connect Student - Votre plateforme d'orientation et de mobilité étudiante
                            </Text>
                        </Section>
                    </Container>
                    <EmailFooter />
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ContactConfirmationEmail;
