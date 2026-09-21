<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\User;
use App\Models\Workshop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@swiftfix.com'],
            [
                'name' => 'SwiftFix Admin',
                'role' => UserRole::Admin,
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'tech@swiftfix.com'],
            [
                'name' => 'Ahmed Specialist',
                'role' => UserRole::Technician,
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        $technicians = collect([
            ['email' => 'tech.ramal@swiftfix.com', 'name' => 'محمود أبو ريدة'],
            ['email' => 'tech.rimal@swiftfix.com', 'name' => 'يوسف النجار'],
            ['email' => 'tech.tuffah@swiftfix.com', 'name' => 'خالد أبو شعبان'],
            ['email' => 'tech.nasr@swiftfix.com', 'name' => 'سامر عودة'],
        ])->map(fn (array $technician) => User::query()->updateOrCreate(
            ['email' => $technician['email']],
            [
                'name' => $technician['name'],
                'role' => UserRole::Technician,
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        ));

        User::query()->updateOrCreate(
            ['email' => 'customer@swiftfix.com'],
            [
                'name' => 'Sarah Al-Mansoor',
                'role' => UserRole::Customer,
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        User::query()->updateOrCreate(
            ['email' => 'test@swiftfix.com'],
            [
                'name' => 'SwiftFix Test Client',
                'role' => UserRole::Customer,
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        $categories = [
            ['name' => 'Plumbing Services', 'slug' => 'plumbing', 'base_price' => 80],
            ['name' => 'Electrical Repairs', 'slug' => 'electrical', 'base_price' => 90],
            ['name' => 'HVAC & Air Conditioning', 'slug' => 'hvac-ac', 'base_price' => 120],
            ['name' => 'Carpentry & Furniture', 'slug' => 'carpentry', 'base_price' => 100],
            ['name' => 'Home Appliances', 'slug' => 'appliances', 'base_price' => 70],
            ['name' => 'Painting & Wall Finish', 'slug' => 'painting', 'base_price' => 85],
        ];

        foreach ($categories as $category) {
            Category::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'description' => $category['name'],
                    'base_price' => $category['base_price'],
                    'is_active' => true,
                ],
            );
        }

        $categorySlugs = collect($categories)->pluck('slug');

        $workshops = collect([
            [
                'name' => 'ورشة الرمال لصيانة الأجهزة',
                'city' => 'غزة',
                'address' => 'حي الرمال، شارع الوحدة',
                'bio' => 'ورشة معتمدة متخصصة في صيانة الأجهزة المنزلية والكهربائية بخبرة تفوق 10 سنوات.',
                'rating' => 4.9,
                'reviews_count' => 128,
                'is_featured' => true,
            ],
            [
                'name' => 'مركز النجار التقني',
                'city' => 'غزة',
                'address' => 'حي الرمال الجنوبي، شارع الجلاء',
                'bio' => 'فريق فني مدرب على أحدث معدات التشخيص والإصلاح مع ضمان حقيقي على كل صيانة.',
                'rating' => 4.7,
                'reviews_count' => 94,
                'is_featured' => true,
            ],
            [
                'name' => 'ورشة التفاح للصيانة السريعة',
                'city' => 'خان يونس',
                'address' => 'حي عبسان، شارع صلاح الدين',
                'bio' => 'خدمة صيانة سريعة خلال نفس اليوم مع أسعار شفافة لكل قطعة وخدمة.',
                'rating' => 4.6,
                'reviews_count' => 67,
                'is_featured' => true,
            ],
            [
                'name' => 'مركز النصر لصيانة الأجهزة',
                'city' => 'رفح',
                'address' => 'حي النصر، شارع الميناء',
                'bio' => 'مركز صيانة موثوق يقدم فحصاً مجانياً قبل بدء أي عملية إصلاح.',
                'rating' => 4.3,
                'reviews_count' => 41,
                'is_featured' => false,
            ],
        ])->values();

        foreach ($workshops as $index => $data) {
            $technician = $technicians[$index] ?? $technicians->first();

            $workshop = Workshop::query()->updateOrCreate(
                ['user_id' => $technician->id],
                [
                    'name' => $data['name'],
                    'bio' => $data['bio'],
                    'city' => $data['city'],
                    'address' => $data['address'],
                    'rating' => $data['rating'],
                    'reviews_count' => $data['reviews_count'],
                    'is_featured' => $data['is_featured'],
                    'is_available' => true,
                ],
            );

            $serviceSlugs = $categorySlugs->random(min(3, $categorySlugs->count()));

            foreach ($serviceSlugs as $slug) {
                $category = Category::query()->where('slug', $slug)->first();

                $workshop->services()->updateOrCreate(
                    ['category_id' => $category->id],
                    ['starting_price' => fake()->randomFloat(2, 50, 300)],
                );
            }

            $workshop->reviews()->updateOrCreate(
                ['client_name' => 'سارة المنصور'],
                [
                    'rating' => 5,
                    'comment' => 'خدمة ممتازة وسرعة في الإنجاز، أنصح بالتعامل معهم.',
                    'is_approved' => true,
                ],
            );

            $workshop->reviews()->updateOrCreate(
                ['client_name' => 'محمد عبد الله'],
                [
                    'rating' => 4,
                    'comment' => 'أسعار معقولة وفريق محترف، تجربة جيدة بشكل عام.',
                    'is_approved' => true,
                ],
            );
        }
    }
}
