import {
    Column,
    Container,
    Img,
    Link,
    Row,
    Text,
} from "@react-email/components";

export const EmailFooter = () => {
    return (
        <Container className="mt-20">
            <Row className="w-full mx-auto flex justify-center items-center gap-4">
                {" "}
                {/* Utilisez flex et gap pour l'espacement */}
                <Column className="w-[30px]">
                    {" "}
                    {/* Chaque icône dans une colonne */}
                    <Link
                        href={
                            "https://www.instagram.com/connect__student?igsh=ajI5YXA4ajJoaTNv&utm_source=qr"
                        }
                    >
                        <Img
                            src={`https://res.cloudinary.com/kinshasa-3d/image/upload/v1751139711/instagram_lrbvta.png`} // Placeholder, remplacez par vos vraies icônes
                            width="24"
                            height="24"
                            alt="Instagram"
                            className="mx-auto"
                        />
                    </Link>
                </Column>
                <Column className="w-[30px]">
                    <Link
                        href={"https://www.facebook.com/share/173mZo3wyg/?mibextid=wwXIfr"}
                    >
                        <Img
                            src={`https://res.cloudinary.com/kinshasa-3d/image/upload/v1751139711/facebook_an6uhd.png`} // Placeholder
                            width="24"
                            height="24"
                            alt="Facebook"
                            className="mx-auto"
                        />
                    </Link>
                </Column>
                <Column className="w-[30px]">
                    <Link href={"https://www.linkedin.com/company/connect-student-officiel"}>
                        <Img
                            src={`https://res.cloudinary.com/kinshasa-3d/image/upload/v1770456805/linkedin2_shq7cr.png`} // Placeholder
                            width="24"
                            height="24"
                            alt="Linkedin"
                            className="mx-auto"
                        />
                    </Link>
                </Column>
            </Row>
            <Text className="mb-45 text-left text-textSecondary text-sm">
                © {new Date().getFullYear()} Connect Student. Tous droits réservés.
                <br />
                Avenue OUA, N°01, Quartier Basoko, Commune de Ngaliema,
                Kinshasa – République Démocratique du Congo
            </Text>
        </Container>
    );
};

export default EmailFooter;
