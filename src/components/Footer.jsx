export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-6 text-center">
      <p>© {new Date().getFullYear()} QuickInvoice NG. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <p>Built and Powered by Binary</p>
        <a href="#privacy" className="hover:underline">Privacy Policy</a>
        <a href="#terms" className="hover:underline">Terms of Service</a>
      </div>
    </footer>
  );
}
