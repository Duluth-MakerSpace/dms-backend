import { Arg, Query, Resolver } from "type-graphql";
import { Certification } from "../entities/Certification";


@Resolver()
export class CertificationResolver {

    @Query(() => [Certification])
    certifications(
    ): Promise<Certification[]> {
        return Certification.find({ order: { title: "ASC" } });
    }

    @Query(() => Certification, { nullable: true })
    certification(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<Certification | null> {
        return Certification.findOne({ where: { uuid: uuid } });
    }

}
