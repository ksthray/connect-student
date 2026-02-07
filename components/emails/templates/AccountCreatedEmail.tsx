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
    Button,
    Link,
} from "@react-email/components";
import EmailFooter from "../components/email-footer";

type AccountCreatedProps = {
    fullname: string;
    otp?: string;
};

export const AccountCreatedEmail = ({ fullname, otp }: AccountCreatedProps) => {
    return (
        <Html>
            <Head />
            <Preview>Bienvenue sur Connect Student ! Votre compte a été créé avec succès.</Preview>
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
                            <Text className="text-textPrimary text-lg font-semibold">Bonjour {fullname},</Text>
                            <Text className="text-textSecondary text-sm mb-6">
                                Bienvenue sur Connect Student ! Nous sommes ravis de vous compter parmi nous.
                                Votre compte a été créé avec succès.
                            </Text>
                            {otp && (
                                <Section className="bg-offwhite p-4 rounded-md mb-6 text-center">
                                    <Text className="text-textSecondary text-sm mb-2">
                                        Voici votre code de vérification :
                                    </Text>
                                    <Text className="text-brand text-3xl font-bold tracking-widest">
                                        {otp}
                                    </Text>
                                    <Text className="text-textSecondary text-xs mt-2">
                                        Ce code est valable pendant 10 minutes.
                                    </Text>
                                </Section>
                            )}
                            <Link href={"https://connect-student.com/offres"} className="text-textSecondary text-sm">
                                Explorez dès maintenant les opportunités de stages et d'emplois qui vous attendent.
                            </Link>
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

export default AccountCreatedEmail;
