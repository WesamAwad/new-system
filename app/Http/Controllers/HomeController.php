<?php

namespace App\Http\Controllers;

use App\Models\Workshop;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('welcome', [
            'featuredWorkshops' => Workshop::query()
                ->featured()
                ->with('services.category:id,name,slug')
                ->orderByDesc('rating')
                ->take(3)
                ->get(),
            'services' => [
                [
                    'title' => 'تبديل الشاشات المكسورة',
                    'description' => 'استبدال الشاشات المكسورة بشاشات أصلية أو مطابقة للمواصفات مع فحص جودة فوري.',
                    'meta' => 'خلال 30-45 دقيقة',
                    'icon' => 'screen',
                ],
                [
                    'title' => 'تغيير وصيانة البطاريات',
                    'description' => 'بطاريات أصلية مع اختبار أداء الشحن والحفاظ على صحة الجهاز بعد الاستبدال.',
                    'meta' => 'ضمان فوري وآمن',
                    'icon' => 'battery',
                ],
                [
                    'title' => 'صيانة منافذ الشحن والصوت',
                    'description' => 'إصلاح منافذ الشحن والسماعات والميكروفون بدقة عالية دون التأثير على اللوحة.',
                    'meta' => 'فحص دقيق للمشكلات',
                    'icon' => 'port',
                ],
                [
                    'title' => 'معالجة أضرار السوائل واللوحات',
                    'description' => 'تشخيص ومعالجة أضرار المياه واللوحات الإلكترونية مع حماية بياناتك أثناء الإصلاح.',
                    'meta' => 'تشخيص مجاني مقدم',
                    'icon' => 'board',
                ],
            ],
            'metrics' => [
                ['label' => '45,000+ جهاز تم إصلاحه', 'icon' => 'devices'],
                ['label' => 'ضمان معتمد 180 يوماً', 'icon' => 'warranty'],
                ['label' => 'دعم فني 24/7', 'icon' => 'support'],
            ],
        ]);
    }
}
