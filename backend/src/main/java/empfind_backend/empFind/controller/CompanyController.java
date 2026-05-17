package empfind_backend.empFind.controller;

import empfind_backend.empFind.entity.Company;
import empfind_backend.empFind.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/companies")
@CrossOrigin(origins = "*")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @GetMapping("/recruiter/{recruiterId}")
    public List<Company> getByRecruiter(@PathVariable Long recruiterId) {
        return companyRepository.findByRecruiterId(recruiterId);
    }

    @PostMapping
    public Company createCompany(@RequestBody Company company) {
        return companyRepository.save(company);
    }

    @PutMapping("/{id}")
    public Company updateCompany(@PathVariable Long id, @RequestBody Company companyDetails) {
        Company company = companyRepository.findById(id).orElseThrow();
        company.setName(companyDetails.getName());
        company.setLocation(companyDetails.getLocation());
        company.setDescription(companyDetails.getDescription());
        company.setLogoUrl(companyDetails.getLogoUrl());
        return companyRepository.save(company);
    }
}
