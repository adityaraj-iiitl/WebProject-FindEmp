package empfind_backend.empFind.service;

import empfind_backend.empFind.entity.Company;
import empfind_backend.empFind.exception.ResourceNotFoundException;
import empfind_backend.empFind.repository.CompanyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    private static final Logger logger = LoggerFactory.getLogger(CompanyService.class);

    @Autowired
    private CompanyRepository companyRepository;

    public List<Company> getAllCompanies() {
        logger.info("Fetching all companies");
        return companyRepository.findAll();
    }

    public List<Company> getCompaniesByRecruiter(Long recruiterId) {
        logger.info("Fetching companies for recruiter: {}", recruiterId);
        return companyRepository.findByRecruiterId(recruiterId);
    }

    public Company createCompany(Company company) {
        logger.info("Creating new company with name: {}", company.getName());
        return companyRepository.save(company);
    }

    public Company updateCompany(Long id, Company companyDetails) {
        logger.info("Updating company with id: {}", id);
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        company.setName(companyDetails.getName());
        company.setLocation(companyDetails.getLocation());
        company.setDescription(companyDetails.getDescription());
        company.setLogoUrl(companyDetails.getLogoUrl());
        return companyRepository.save(company);
    }
}
