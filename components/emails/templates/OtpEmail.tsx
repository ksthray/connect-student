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

type OtpProps = {
    fullname: string;
    otp: string;
}

export const OtpEmail = ({ fullname, otp }: OtpProps) => {
    return (
        <Html>
            <Head />
            <Preview>Code OTP pour la connexion à votre compte Connect Student</Preview>
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
                            spacing: {
                                0: "0px",
                                10: "10px",
                                20: "20px",
                                45: "45px",
                                60: "60px",
                            },
                        },
                    },
                }}>
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
                            <Text className="text-textSecondary text-sm">
                                Voici votre code OTP pour la connexion à votre compte Connect Student :
                            </Text>
                            <Text className="text-textPrimary text-2xl font-bold">{otp}</Text>
                            <Text className="text-textSecondary text-sm">
                                Ce code est valable pendant 10 minutes.
                            </Text>
                            <Text className="text-textSecondary text-sm">
                                Si vous n'avez pas demandé ce code, veuillez ignorer ce message.
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