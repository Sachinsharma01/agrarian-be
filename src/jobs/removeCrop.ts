import Container from "typedi";
import { Logger } from "winston";

export default class RemoveCrop {
    public async handler(job, done): Promise<void> {
        const Logger: Logger = Container.get('Logger');
        try {
            
        } catch(err) {

        }
    }
}