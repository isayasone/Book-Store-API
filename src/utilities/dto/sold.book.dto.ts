import { ApiProperty } from "@nestjs/swagger";
import { BookDto } from "./book.dto";
export class SoldBookDto extends  BookDto {

    @ApiProperty()
    customerName: string;
  
    @ApiProperty()
    customerEmail: string;

    @ApiProperty()
    soldDate:Date;

    constructor()
    {
        super()
        delete this.status;
    }

    static mapSoldBookDto(book)
    {
    const  bookDto=this.mapToBookDto(book);   
    return {...bookDto , customerName:`${book?.order?.customer.frist_name}  ${book?.order?.customer.last_name}`,
    customerEmail:book?.order?.customer.email,  soldDate:book?.order?.createdAt }
    }

}