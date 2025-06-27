export default function Footer() {
    return (
        <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-8 z-10">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                    {/* Acknowledgements section */}
                    <div className="text-center md:text-left">
                        <h4 className="font-medium text-base mb-3">Made with ❤️ by an <a target="_blank" className="text-blue-500 underline" href="https://www.linkedin.com/in/muhammad-saadiq-0a333b324/">IITian</a></h4>
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Edmit. All rights reserved.
                        </p>
                    </div>

                    {/* Links section */}
                    <div className="text-center md:text-right">
                        <nav className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
                            <a href="/contact" className="hover:underline transition">Contact Us</a>
                            <a href="/terms" className="hover:underline transition">Terms of Use</a>
                            <a href="/privacy" className="hover:underline transition">Privacy Policy</a>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    );
}
