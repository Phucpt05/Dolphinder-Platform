/*
/// Module: dolphinder_profiles
module dolphinder_profiles::dolphinder_profiles;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions


module dolphinder_profiles::profiles {
    use std::string::{String};
    use sui::table::{Self, Table};
    use std::vector;
    use sui::event;

    const EDuplicateVote: u64 = 1;

    /// Profile structure for builder information
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
        transfer::public_transfer(profile, ctx.sender());
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
        transfer::public_transfer(project, tx_context::sender(ctx));
    }

    public fun vote (project: &mut Project, vote_yes: bool, ctx: &mut TxContext){
        assert!(project.voters.contains(ctx.sender()), EDuplicateVote);
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
}
