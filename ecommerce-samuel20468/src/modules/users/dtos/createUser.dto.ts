import {
  Equals,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from "class-validator";

export class UserDto {
  /**
   * User valid email
   * @example me@example.com
   */
  @IsNotEmpty({ message: "El email es obligatorio" })
  @IsEmail({}, { message: "El correo electrónico debe ser válido" })
  @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "El email contiene caracteres no permitidos",
  })
  @IsString({ message: "El email debe ser una cadena de texto" })
  @MaxLength(50)
  email: string;

  /**
   * User name
   * @example "test user"
   */
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @Length(3, 80, { message: "El nombre debe contener entre 3 y 80 carácteres" })
  name: string;

  /**
   * User valid password
   * @example Password123*
   */
  @IsNotEmpty({ message: "La contraseña es obligatoria" })
  @IsString({ message: "La contraseña debe ser una cadena de texto" })
  @Length(8, 15, {
    message: "La contraseña debe tener entre 8 y 15 caracteres",
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    {
      message:
        "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y uno de los siguientes caracteres especiales: !@#$%^&*",
    },
  )
  password: string;

  /**
   * Must match with field "password"
   * @example Password123*
   */
  @IsNotEmpty({ message: "La confirmación de la contraseña es obligatoria" })
  confirmPassword: string;

  /**
   * User valid phone number
   * @example 2124567890
   */
  @IsNotEmpty({ message: "El teléfono es obligatorio" })
  @IsInt({ message: "El teléfono debe ser un número" })
  phone: number;

  /**
   * User country - *Optional property
   * @example USA
   */
  @IsOptional()
  @IsString({ message: "El país debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El país es obligatorio" })
  @Length(3, 20, { message: "El país debe contener entre 5 y 20 carácteres" })
  country?: string | undefined;

  /**
   * User valid address
   * @example "132, My Street"
   */
  @IsNotEmpty({ message: "La dirección es obligatoria" })
  @IsString({ message: "La dirección debe ser una cadena de texto" })
  @Length(3, 80, {
    message: "La dirección debe contener entre 3 y 80 carácteres",
  })
  address: string;

  /**
   * User city *Optional property
   * @example "New York"
   */
  @IsOptional()
  @IsString({ message: "La ciudad debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La ciudad es obligatoria" })
  @Length(3, 20, { message: "La ciudad debe contener entre 5 y 20 carácteres" })
  city?: string | undefined;
}
