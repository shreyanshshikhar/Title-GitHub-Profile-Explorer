import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  username: string = ''; // Input field for GitHub username
  repositories: any[] = []; // Array to store repositories data
  currentPage: number = 1; // Current page number
  totalPages: number = 1; // Total number of pages
  pageSize: number = 10; // Number of repositories per page
  pageSizeOptions: number[] = [10, 20, 50, 100]; // Options for page size
  user: any; // Variable to hold user data
  loadingUser: boolean = false; // Flag to track loading state of user data
  loadingRepos: boolean = false; // Flag to track loading state of repositories data

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // You can optionally perform initial actions here when the component initializes
  }

  // Function to search for repositories
  searchRepositories() {
    this.currentPage = 1; 
    this.loadingUser = true; // Set loading flag for user data
    this.fetchUser(); // Fetch user information
    // Reset current page to 1 when searching
    this.fetchRepositories();
  }

  // Function to fetch repositories from GitHub API
  fetchRepositories() {
    this.loadingRepos = true; // Set loading flag for repositories data
    const apiUrl = `https://api.github.com/users/${this.username}/repos?page=${this.currentPage}&per_page=${this.pageSize}`;
    console.log("API URL:", apiUrl);
    this.http.get<any[]>(apiUrl).subscribe(
      (data) => {
        console.log("Response:", data);
        this.repositories = data;
        this.loadingRepos = false; // Reset loading flag for repositories data
        // Extract total pages from response headers or calculate based on total repositories count
        // For simplicity, let's assume total pages are known
        this.totalPages = 10; // Example value
      },
      (error) => {
        console.error('Error fetching repositories:', error);
        this.loadingRepos = false; // Reset loading flag for repositories data on error
      }
    );
  }

  // Function to fetch user data from GitHub API
  fetchUser() {
    const apiUrl = `https://api.github.com/users/${this.username}`;
    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        this.user = data; // Assign user data to the user object
        console.log('User Data:', data); // Log available data to the console
        this.loadingUser = false; // Reset loading flag for user data
      },
      (error) => {
        console.error('Error fetching user:', error);
        this.loadingUser = false; // Reset loading flag for user data on error
      }
    );
  }

  // Function to toggle hover class for repository cards
  toggleHoverClass(repo: any) {
    repo.hover = !repo.hover;
  }

  // Function to navigate to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchRepositories();
    }
  }

  // Function to navigate to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchRepositories();
    }
  }

  // Function to change page size
  changePageSize() {
    this.currentPage = 1; // Reset current page to 1 when changing page size
    this.fetchRepositories();
  }
}
