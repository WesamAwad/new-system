export default function Footer() {
    return (
        <footer className="border-border/40 border-t bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <p className="text-muted-foreground text-center sm:text-right">
                    جميع الحقوق محفوظة © سويفت فيكس {new Date().getFullYear()}{' '}
                    SwiftFix
                </p>
                <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                    <a href="#privacy" className="hover:text-foreground">
                        سياسة الخصوصية
                    </a>
                    <a href="#terms" className="hover:text-foreground">
                        شروط الاستخدام
                    </a>
                    <a href="#support" className="hover:text-foreground">
                        مركز الدعم والمساعدة
                    </a>
                </div>
            </div>
        </footer>
    );
}
