<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    private const NAMES = ['María', 'José', 'Ana', 'Luis', 'Carmen', 'Carlos', 'Rosa', 'Jorge', 'Lucía', 'Miguel', 'Gabriela', 'Fernando'];

    private const LAST_NAMES = ['Quispe', 'Mamani', 'Rojas', 'Vargas', 'Suárez', 'Justiniano', 'Égüez', 'Montaño', 'Rivero', 'Parada', 'Cuéllar', 'Melgar'];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->randomElement(self::NAMES),
            'second_name' => fake()->optional()->randomElement(self::NAMES),
            'first_last_name' => fake()->randomElement(self::LAST_NAMES),
            'second_last_name' => fake()->optional(0.8)->randomElement(self::LAST_NAMES),
            'ci' => (string) fake()->unique()->numberBetween(1000000, 9999999),
            'ci_issued_in' => fake()->randomElement(array_keys(Customer::ISSUED_IN)),
            'birth_date' => fake()->dateTimeBetween('-80 years', '-18 years'),
            'gender' => fake()->randomElement(array_keys(Customer::GENDERS)),
            'phone_country_code' => '+591',
            'phone' => fake()->numerify('7#######'),
            'email' => fake()->optional()->safeEmail(),
            'address' => fake()->optional()->streetAddress(),
        ];
    }

    /**
     * Cliente desactivado.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => ['is_active' => false]);
    }
}
