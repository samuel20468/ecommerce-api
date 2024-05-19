import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
  /**
   * Email of registered user
   * @example me@example.com
   */
  @IsNotEmpty({ message: "El correo electrónico es obligatorio" })
  @IsEmail({}, { message: "El correo electrónico debe ser válido" })
  @IsString({ message: "El correo electrónico debe ser una cadena de texto" })
  email: string;

  /**
   * Password of registered user
   * @example Password123*
   */
  @IsNotEmpty({ message: "La contraseña es obligatoria" })
  @IsString({ message: "La contraseña debe ser una cadena de texto" })
  password: string;
}
