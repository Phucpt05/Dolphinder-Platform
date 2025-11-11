module dolphinder_profiles::profiles {
    use std::string::{String};
    use sui::table::{Self, Table};
    use std::vector;

    const EDuplicateVote: u64 = 1;
    const ENotPublisher: u64 = 0;

    public struct Dashboard has key, store{
        id: UID,
        verified_profiles: vector<ID>,
        creator: address,
    }
    // public struct List_projects has key, store{
    //     id: UID,
    //     list_projects: vector<ID>,
    //     creator: address,
    // }
    // public struct List_certificates has key, store{
    //     id: UID,
    //     list_certificates: vector<ID>,
    //     creator: address,
    // }

    public struct Profile has key, store {
        id: UID,
        owner: address,
        name: String,
        username: String,
        github: String,
        linkedin: String,
        bio: String,
        slushwallet: String,
        ava_image_blod_id: String,
        list_projects: vector<ID>,
        list_certificates: vector<ID>,
    }

    public struct Project has key, store {
        id: UID,
        owner: address,
        title: String,
        technologies: vector<String>,
        description: String,
        github_link: String,
        youtube_link: String,
        img_prj_blods_id: String,
        voters: Table<address, bool>,
        vote_count: u64
    }

    public struct Certificate has key, store {
        id: UID,
        owner: address,
        organization: String,
        title: String,
        date: String,
        expiry_date: String,
        verify_link: String,
        img_cer_blods_id: String
    }   

    fun init(ctx: &mut TxContext) {
        let dashboard = Dashboard{
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            verified_profiles: vector::empty<ID>(),
        };
        transfer::share_object(dashboard);
    }
    
    // public functions
    public entry fun verify_profile(
        dashboard: &mut Dashboard,
        name: String,
        username: String,
        github: String,
        linkedin: String,
        bio: String,
        slushwallet: String,
        ava_image_blod_id: String,
        ctx: &mut TxContext
    ) {
        let profile = Profile {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            name,
            username,
            github,
            linkedin,
            bio,
            slushwallet,
            ava_image_blod_id,
            list_projects: vector::empty<ID>(),
            list_certificates: vector::empty<ID>(),
        };
        vector::push_back(&mut dashboard.verified_profiles, profile.id.to_inner());        
        transfer::share_object(profile);
    }


    public entry fun create_certificate(
        profile: &mut Profile,
        organization: String,
        title: String,
        date: String,
        expiry_date: String,
        verify_link: String,
        img_cer_blods_id: String,
        ctx: &mut TxContext
    ) {
        let certificate = Certificate {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            organization,
            title,
            date,
            expiry_date,
            verify_link,
            img_cer_blods_id,
        };
        vector::push_back(&mut profile.list_certificates, certificate.id.to_inner());
        transfer::public_transfer(certificate, tx_context::sender(ctx));
    }

    public entry fun create_project_showcase(
        profile: &mut Profile,
        title: String,
        technologies: vector<String>,
        description: String,
        github_link: String,
        youtube_link: String,
        img_prj_blods_id: String,
        ctx: &mut TxContext
    ) {
        let project = Project {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            title ,
            technologies,
            description,
            github_link ,
            img_prj_blods_id,
            youtube_link,
            voters: table::new(ctx),
            vote_count: 0
        };
        vector::push_back(&mut profile.list_projects, project.id.to_inner());
        transfer::share_object(project);
    }

    public fun vote (project: &mut Project, vote_yes: bool, ctx: &mut TxContext){
        assert!(!project.voters.contains(ctx.sender()), EDuplicateVote);
        if(vote_yes){
            project.vote_count = project.vote_count + 1;
        };
        table::add(&mut project.voters, ctx.sender(), vote_yes);
    }


    public fun profile_owner(profile: &Profile): address {
        profile.owner
    }

    public fun project_owner(project: &Project): address {
        project.owner
    }

    public fun certificate_owner(certificate: &Certificate): address {
        certificate.owner
    }

    public entry fun remove_profile(
        dashboard: &mut Dashboard,
        current_address: address,
        profile: Profile,
        ctx: &mut TxContext
    ) {
        assert!(dashboard.creator == current_address, ENotPublisher);
        
        let profile_id = profile.id.to_inner();
        let mut i = 0;
        while (i < vector::length(&dashboard.verified_profiles)) {
            if (vector::borrow(&dashboard.verified_profiles, i) == &profile_id) {
                vector::remove(&mut dashboard.verified_profiles, i);
                break
            };
            i = i + 1;
        };
        
        let Profile { id, owner: _, name: _, username: _, github: _, linkedin: _,
                     bio: _, slushwallet: _, ava_image_blod_id: _, list_projects: _,
                     list_certificates: _ } = profile;
        object::delete(id);
    }
}
