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
} from "@react-email/components";
import EmailFooter from "../components/email-footer";

type ApplicationConfirmationProps = {
    candidateName: string;
    jobTitle: string;
    companyName: string;
    coverJob?: string;
    trackUrl?: string;
};

export const ApplicationConfirmationEmail = ({
    candidateName,
    jobTitle,
    companyName,
    coverJob,
}: ApplicationConfirmationProps) => {
    return (
        <Html>
            <Head />
            <Preview>Votre candidature pour le poste de {jobTitle} a été envoyée avec succès.</Preview>
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
                            <Text className="text-textPrimary text-lg font-semibold capitalize">Félicitations {candidateName},</Text>
                            <Text className="text-textSecondary text-sm mb-6">
                                Votre candidature pour le poste de <span className="font-semibold text-brand">{jobTitle}</span> chez <span className="font-semibold">{companyName}</span> a bien été transmise.
                            </Text>
                            <Section className="bg-offwhite p-6 rounded-md mb-8">
                                <Text className="text-textPrimary font-semibold text-center mb-2">Prochaines étapes</Text>
                                <Text className="text-textSecondary text-sm text-center">
                                    L'entreprise examinera votre profil et vous contactera directement si votre candidature est retenue pour la suite du processus.
                                </Text>
                            </Section>
                            {/* cover job */}
                            {coverJob && (
                                <Section className="bg-offwhite p-6 rounded-md mb-8">
                                    <Img
                                        src={coverJob}
                                        width="250"
                                        height="auto"
                                        alt={jobTitle}
                                        className="mx-auto my-10"
                                    />
                                </Section>
                            )}
                            <Section className="text-center mb-6">
                                <Button
                                    className="bg-brand text-white px-6 py-3 rounded-md font-semibold text-sm no-underline"
                                    href={'https://connect-student.com/connexion'}
                                >
                                    Connectez-vous à votre compte afin de suivre votre candidature
                                </Button>
                            </Section>
                            <Text className="text-textSecondary text-sm text-center">
                                Bonne chance dans vos démarches !
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

export default ApplicationConfirmationEmail;
