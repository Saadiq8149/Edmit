// "use client";
import React from "react";


export default function TermsOfUsePage() {
    return (
        <main className="bg-white min-h-screen">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Terms of Use</h1>
                <p className="text-lg font-medium text-gray-700 mb-8">
                    Please read carefully before using the site.
                </p>

                <div className="prose prose-blue max-w-none">
                    <p className="text-gray-600">
                        The following terms and conditions will be deemed to have been accepted by every individual visiting this website (edmit.in).
                        You are requested to read them carefully before you use the services of this site. By using the site, you agree to follow and be bound by the
                        following terms and conditions concerning your use of the site. Edmit may revise the Terms of Use at any time without notifying you.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Usage and Content Posted</h2>
                    <p className="text-gray-600">
                        Edmit holds the sole rights of all the content available throughout the website other than the information freely available on internet
                        under the fair usage policy. The content can only be used for personal use by providing proper credits and a link to the source.
                        Trademark of Edmit cannot be used to be displayed for any commercial or non-commercial use without prior permission from the managing company.
                        The content downloaded from the website does not pass the rights or title to use it for commercial use. All the data mining activities
                        i.e. scrapping, crawling and republishing is not allowed until and unless written permission is obtained from the company.
                    </p>
                    <p className="text-gray-600">
                        Edmit does not accept any responsibility towards the contents and/or information practices of third party sites which have links
                        through Edmit site. The said links to internal or external website locations are only for the purpose of facilitating your visit or clarify your query.
                    </p>
                    <p className="text-gray-600">
                        Any material, information or other communication that the visitor transmits or posts to the website shall be treated as non-confidential and non-proprietary.
                        We don't take responsibility of such content. The visitor is prohibited from posting or transmitting to or from the website any threatening, libellous, defamatory,
                        obscene, pornographic, or otherwise offensive material, or material that would violate any law or sensibility of any person.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Payment Terms for the Paid products</h2>
                    <p className="text-gray-600">
                        Amount payable towards any of the paid products like College Financial Advising, Premium Membership, College Cost Calculator, etc.,
                        will be displayed to the user before he/she makes payment. Unless otherwise expressly mentioned, full payments towards any of the
                        products or services offered by Edmit shall be made before accessing the programs or services. It is the sole responsibility of the
                        user purchasing a product or service on our Platform to assess the suitability and relevance of the product of service proposed to be purchased.
                    </p>
                    <p className="text-gray-600">
                        In the event of any suspension or termination of services on account of non-compliance of these Terms of Use,
                        any payment made to the Company by you shall stand forfeited with immediate effect.
                    </p>
                    <p className="text-gray-600">
                        To make payment for any services or products offered by Edmit, you must have internet access and a current valid accepted payment method.
                        Edmit does not store any of your credit/debit card/bank account/other payment method information or such other information restricted
                        by the Reserve Bank of India (RBI) for processing payment and has partnered with payment gateways for the payment towards the services.
                        By using a third-party payment provider, you agree to abide by the terms of such a payment provider.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Refund / Cancellation Policy</h2>
                    <p className="text-gray-600">
                        Amount paid towards products/services purchased will be neither refunded nor adjusted under any circumstance.
                        Our customer service team would be available to address any concerns related to the product and services rendered by us.
                    </p>
                    <p className="text-gray-600">
                        For further information, please write to us at our <a href="/contact">Contact page</a>.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Indemnification and Warranties</h2>
                    <p className="text-gray-600">
                        In no event will Edmit be liable for damages of any kind, including without limitation, direct, incidental or consequential damages
                        (including, but not limited to, damages for lost profits and loss of programs or information) arising out of the use of or inability to use
                        Edmit website, or any information provided on the website, or in the Products any claim attributable to errors, omissions or other
                        inaccuracies in the Product or interpretations thereof.
                    </p>
                    <p className="text-gray-600">
                        The User agrees to indemnify, defend and hold Edmit harmless from and against all losses, expenses, damages and costs, including reasonable
                        attorneys' fees, arising out of or relating to any misuse by the User of the content and services provided on the site.
                    </p>
                    <p className="text-gray-600">
                        The information contained in the site has been obtained from sources believed to be reliable. Edmit disclaims all
                        warranties as to the accuracy, completeness or adequacy of such information.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">General Disclaimer</h2>
                    <p className="text-gray-600">
                        Though the website has been designed with utmost care but due to some inevitable error quotient in human working, the graphics and
                        documents may have some typographical or technical errors which will be removed or edited from time to time as the website will be updated.
                        The aforesaid improvements or alterations can be done at any time. Also Edmit will not take any representation over the misinformed
                        documents or any typographical error including the graphical errors that appear on the website for any purpose.
                        The information has been provided as per the most recent and relevant available information "AS IS".
                    </p>
                    <p className="text-gray-600 mb-8">
                        For further information, please write to us at the support page.
                    </p>

                    <div className="border-t border-gray-200 pt-8 mt-8">
                        <p className="text-sm text-gray-500 text-center">
                            © {new Date().getFullYear()} Edmit. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
