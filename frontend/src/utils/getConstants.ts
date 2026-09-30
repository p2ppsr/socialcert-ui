import { getBaseUrl } from './getBackendUrl'
import { families } from './certification'
/** Family identifiers are compatibility inventory. Issuer identity is fetched from /metadata. */
export default function getConstants(){return {certifierUrl:getBaseUrl(), certificateTypes:{email:families.email.type,x:families.x.type,discord:families.discord.type}}}
